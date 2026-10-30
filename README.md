# LG TV Cleanup

An Apple TV style home screen for LG webOS, plus helper scripts to talk to your TV.

## What is here

- `app/` is a webOS web app. It shows a large greeting, a clock, and a row of app tiles. Left and right move focus. OK launches the app.
- `app/apps.json` sets the tiles. Edit names, colors, and app IDs.
- `scripts/tv.py` lists installed app IDs and launches apps over the network.
- `scripts/deploy.sh` packages and installs the launcher with LG's `ares-cli`.

## Setup

1. Create a free account at the LG Developer site.
2. On the TV, install the Developer Mode app from the LG Content Store, sign in, turn Dev Mode on, restart, then turn Key Server on.
3. On your computer, install the CLI and Python dependency:

   ```bash
   npm install -g @webosose/ares-cli
   pip install -r requirements.txt
   ```

4. Find the real app IDs for your TV and update `app/apps.json`:

   ```bash
   python scripts/tv.py <tv-ip> apps
   ```

5. Install and launch:

   ```bash
   scripts/deploy.sh <tv-ip>
   ```

The launcher appears in your TV's app list as "Home". Dev Mode installs expire after about 50 hours unless you renew them in the Developer Mode app, so renew or reinstall when the app disappears.

## Limits

- This does not replace LG's system home screen. It is an app you open from it.
- No root is needed. Boot logo and system level changes need root and are not covered here.
- App IDs differ by region and webOS version. Use `tv.py apps` to confirm.
