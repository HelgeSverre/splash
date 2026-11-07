export type ServerInfo = { name: string; instance: string; token: string; version?: string };
export type ConnectionView = { status: "connecting" | "online" | "offline" | "auth" | "syncing"; name: string; error: string; recovered: number; checking: boolean };

/** Owns connection transitions so an auth event wins over an older retry. */
export class ServerConnection {
  private checking = false;
  private ready = false;
  private recoveryNeeded = false;
  private knownInstance = "";
  private generation = 0;
  private readonly view: ConnectionView;
  private readonly state: () => Promise<ServerInfo | undefined>;
  private readonly reconcile: () => Promise<void>;
  private readonly receive: (info: ServerInfo) => void;

  constructor(
    view: ConnectionView,
    state: () => Promise<ServerInfo | undefined>,
    reconcile: () => Promise<void>,
    receive: (info: ServerInfo) => void,
  ) {
    this.view = view;
    this.state = state;
    this.reconcile = reconcile;
    this.receive = receive;
  }

  offline() {
    if (this.view.status === "auth") return false;
    this.view.status = "offline";
    this.recoveryNeeded = true;
    return true;
  }

  auth() {
    this.generation++;
    this.view.status = "auth";
    this.view.error = "";
    this.recoveryNeeded = false;
  }

  reconnect() {
    if (this.view.status !== "auth") this.recoveryNeeded = true;
  }

  async check() {
    if (this.checking || this.view.status === "auth") return false;
    this.checking = true;
    this.view.checking = true;
    const generation = this.generation;
    try {
      const info = await this.state();
      if (!this.current(generation)) return false;
      if (!info) { this.auth(); return false; }
      if (info.instance !== this.knownInstance) this.recoveryNeeded = true;
      this.knownInstance = info.instance;
      this.receive(info);
      this.view.name = info.name;
      if (!this.ready || this.recoveryNeeded) {
        this.view.status = "syncing";
        this.recoveryNeeded = false;
        await this.reconcile();
        if (!this.current(generation)) return false;
        this.ready = true;
        this.view.recovered++;
      }
      if (!this.recoveryNeeded) { this.view.status = "online"; this.view.error = ""; }
      return this.recoveryNeeded;
    } catch {
      if (!this.current(generation)) return false;
      this.view.status = "offline";
      this.recoveryNeeded = true;
      this.view.error = "Check that the server and SSH tunnel are running. Your drafts are kept here.";
      return true;
    } finally {
      this.checking = false;
      this.view.checking = false;
    }
  }

  private current(generation: number) { return this.generation === generation && this.view.status !== "auth"; }
}
