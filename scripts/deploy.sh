#!/usr/bin/env bash
# Package the launcher and install it on a TV in Developer Mode.
# Usage: scripts/deploy.sh <tv-ip>
set -euo pipefail

TV_IP="${1:?Usage: scripts/deploy.sh <tv-ip>}"
APP_ID="com.kaeden.applelauncher"
DEVICE="lgtv"

if ! ares-setup-device --list | grep -q "^${DEVICE}"; then
  ares-setup-device --add "${DEVICE}" -i "host=${TV_IP}" -i "port=9922" -i "username=prisoner"
  echo "Open the Developer Mode app on the TV and read the passphrase."
  ares-novacom --device "${DEVICE}" --getkey
fi

mkdir -p build
ares-package app -o build
ares-install --device "${DEVICE}" "build/${APP_ID}_0.1.0_all.ipk"
ares-launch --device "${DEVICE}" "${APP_ID}"
