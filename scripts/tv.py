#!/usr/bin/env python3
"""List installed apps on an LG webOS TV, or launch one.

Usage:
  python scripts/tv.py 192.168.1.50 apps
  python scripts/tv.py 192.168.1.50 launch netflix

The TV shows a pairing prompt on first run. The client key is saved to
.tv-key so later runs connect without a prompt.
"""
import asyncio
import sys
from pathlib import Path

from aiowebostv import WebOsClient

KEY_FILE = Path(".tv-key")


async def main(host: str, command: str, arg: str | None) -> None:
    key = KEY_FILE.read_text().strip() if KEY_FILE.exists() else None
    client = WebOsClient(host, client_key=key)
    await client.connect()
    if client.client_key:
        KEY_FILE.write_text(client.client_key)

    if command == "apps":
        for app_id, app in sorted(client.apps.items(), key=lambda kv: kv[1]["title"].lower()):
            print(f"{app['title']:<32} {app_id}")
    elif command == "launch" and arg:
        await client.launch_app(arg)
        print(f"Launched {arg}")
    else:
        sys.exit(__doc__)

    await client.disconnect()


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    asyncio.run(main(sys.argv[1], sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None))
