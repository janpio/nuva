import type { Hierarchical } from "$lib/types";
import { BASE_PATH, LOCALSTORAGE_SETTINGS_KEY, SITE_NAME, SITE_NAME_DELIMITER } from "$lib/config";
import { browser } from "$app/environment";

export const toastThemes = {
  error: {
    theme: {
      "--toastBackground": "var(--error-background)"
    }
  },
  success: {
    theme: {
      "--toastBackground": "var(--success-background)"
    }
  },
  info: {
    theme: {
      "--toastBackground": "var(--info-background)"
    }
  }
};

export const objectsToHierarchy = (arr: Hierarchical[]) => {
  let arrMap = new Map(arr.map((item: Hierarchical) => [item._id, item]));
  let tree: Hierarchical[] = [];

  for (let i = 0; i < arr.length; i++) {
    let item = arr[i];

    if (item._parentId) {
      let parentItem = arrMap.get(item._parentId);

      if (parentItem) {
        let { children } = parentItem;

        if (children) {
          parentItem.children.push(item);
        } else {
          parentItem.children = [item];
        }
      }
    } else {
      tree.push(item);
    }
  }

  return tree;
};

export let getPageTitle = (title: string) => {
  return title ? `${title} ${SITE_NAME_DELIMITER} ${SITE_NAME}` : SITE_NAME;
};
export let getPageUrl = (slug: string) => {
  return `${BASE_PATH}/${slug}`;
};

export let formatSecondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.floor(seconds % 60);
  return `${minutes}:${secondsRemainder < 10 ? "0" : ""}${secondsRemainder}`;
};

export let createBaseSettings = () => {
  if (browser && !localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY)) {
    localStorage.setItem(LOCALSTORAGE_SETTINGS_KEY, JSON.stringify({
      volume: 50
    }));
  }
};

export let saveVolume = (volume: number) => {
  if (browser) {
    const settings = JSON.parse(<string>localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY));
    settings.volume = volume;
    localStorage.setItem(LOCALSTORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }
};

export let loadVolume = () => {
  if (browser) {
    if (localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY)) {
      return JSON.parse(<string>localStorage.getItem(LOCALSTORAGE_SETTINGS_KEY)).volume;
    }
  }
  return 0;
};
