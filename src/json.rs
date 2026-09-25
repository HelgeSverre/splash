//! Reading strings out of loosely-shaped JSON (agent messages, config files).

use serde_json::Value;

/// `v[key]` as a string; `""` when missing or not a string.
pub fn str_at(v: &Value, key: &str) -> String {
    v[key].as_str().unwrap_or("").to_string()
}

/// `v[key]` as a non-empty string.
pub fn str_opt(v: &Value, key: &str) -> Option<String> {
    v[key].as_str().filter(|s| !s.is_empty()).map(String::from)
}

/// `v[key]` as a non-empty string, else `default`.
pub fn str_or(v: &Value, key: &str, default: &str) -> String {
    str_opt(v, key).unwrap_or_else(|| default.to_string())
}
