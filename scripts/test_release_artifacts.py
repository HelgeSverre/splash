"""Check the publisher's actual workflow patterns against its artifact inventory."""

import re
import unittest
from fnmatch import fnmatchcase
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ReleaseArtifactTests(unittest.TestCase):
    def test_publisher_collects_packages_without_native_test_diagnostics(self):
        workflow = (ROOT / ".github/workflows/release.yml").read_text()
        publisher = workflow.split("\n  publish:\n", 1)[1]
        patterns = re.findall(r"^\s+pattern:\s+(\S+)", publisher, re.MULTILINE)
        shipping = {
            "splash-macos-pkg",
            "splash-macos-macos-15",
            "splash-macos-macos-15-intel",
            "splash-packages-macos-15",
            "splash-packages-macos-15-intel",
            "splash-packages-ubuntu-24.04",
            "splash-packages-windows-2025",
        }
        inventory = shipping | {
            "splash-windows-native-tests",
            "splash-future-diagnostics",
            "playwright-report",
        }
        selected = {
            name
            for name in inventory
            if any(fnmatchcase(name, pattern.strip("\"'")) for pattern in patterns)
        }
        self.assertEqual(selected, shipping)


if __name__ == "__main__":
    unittest.main()
