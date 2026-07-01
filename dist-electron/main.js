import { app, shell } from "electron";
import fs from "fs";
import { fileURLToPath } from "url";

const RENDERER_DEV_SERVER_URL = "http://localhost:5173/";
const ALLOWED_EXTERNAL_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function isRendererDevMode() {
  return process.env.NODE_ENV === "development" || !app.isPackaged;
}

function isTrustedRendererUrl(rawUrl) {
  try {
    const parsedUrl = new URL(rawUrl);
    if (parsedUrl.protocol === "file:") {
      return true;
    }
    if (!isRendererDevMode()) {
      return false;
    }
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return false;
    }
    return parsedUrl.origin === new URL(RENDERER_DEV_SERVER_URL).origin;
  } catch {
    return false;
  }
}

function toSafeExternalUrl(rawUrl) {
  if (typeof rawUrl !== "string") {
    return null;
  }
  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) {
    return null;
  }
  try {
    const parsedUrl = new URL(trimmedUrl);
    return ALLOWED_EXTERNAL_PROTOCOLS.has(parsedUrl.protocol) ? parsedUrl.toString() : null;
  } catch {
    return null;
  }
}

function openExternalIfAllowed(rawUrl) {
  const safeUrl = toSafeExternalUrl(rawUrl);
  if (!safeUrl) {
    return;
  }
  shell.openExternal(safeUrl).catch((error) => {
    console.warn("[navigation] Failed to open external URL:", error);
  });
}

app.on("browser-window-created", (_event, window) => {
  const webContents = window.webContents;
  webContents.on("will-navigate", (event, url) => {
    if (isTrustedRendererUrl(url)) {
      return;
    }
    event.preventDefault();
    openExternalIfAllowed(url);
  });
  webContents.setWindowOpenHandler(({ url }) => {
    openExternalIfAllowed(url);
    return { action: "deny" };
  });
});

function patchBundledMainIfWritable() {
  try {
    const bundlePath = fileURLToPath(new URL("./main-B8fgRKXF.js", import.meta.url));
    const source = fs.readFileSync(bundlePath, "utf8");
    const brokenNelEscape = 'h === 78 ? "' + String.fromCharCode(10) + '"';
    const safeNelEscape = 'h === 78 ? "\\x85"';
    const patched = source.replace(brokenNelEscape, safeNelEscape);
    if (patched !== source) {
      fs.writeFileSync(bundlePath, patched);
    }
  } catch (error) {
    console.warn("[startup] Unable to patch bundled main file:", error);
  }
}

patchBundledMainIfWritable();

const mainModule = await import("./main-B8fgRKXF.js");

const bridgeConnectionController = mainModule.b;
const getBridgeConnectionController = mainModule.a;
const initBridgeConnectionController = mainModule.d;

export {
  bridgeConnectionController,
  getBridgeConnectionController,
  initBridgeConnectionController
};
