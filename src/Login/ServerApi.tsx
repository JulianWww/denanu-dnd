import Character from "../components/monsters/Character";
import Spell, { SpellIndex } from "../components/spells/Spell";
import { MonsterIndex } from "../pages/SelectMonserStatBlock";
import { Token } from "./UseToken"

interface BaseLocationData {
  group: string;
  source: string;
}

export interface LocationData extends BaseLocationData {
  name: string;
}

export function locationDataEquals(a: LocationData, b: LocationData) {
  return a.name === b.name && a.group === b.group && a.source === b.source;
}

export interface Index {
  idx: LocationData;
  file: string;
}

export const backendUrl="http://localhost:8000/server_backend"


export async function getJson(source: string, name: string) {
  return fetch("/publicResources/" + source + "/" + name + ".json", {
    method: 'GET'
  })
    .then(data => {return data.json()})
}

async function loadIndex<T extends Index>(source: string, path: BaseLocationData) {
  return (await getJson(source, "_index") as T[]).map((val: T) => {
    val.idx = {...path, name: val.file}
    return val;
  }); 
}

export function toUrl(idx: LocationData) {
  return idx.group + "/" + idx.source + "/" + idx.name;
}

export async function loadPublicMonsterIndex(source: string) {
  return loadIndex<MonsterIndex>(source, {group: "public", source: "monstermanual"});
}

export async function loadPublicSpellIndex(source: string) {
  return loadIndex<SpellIndex>(source, {group: "public", source: source});
}

export async function readPrivateData(token: Token, group: string, name: string) {
  return fetch(backendUrl + '/download.php?' +  new URLSearchParams({
      username: token.username,
      group: group,
      name: name,
      token: token.token,
    }), {
    method: 'GET',
    headers: {
    }
  })
  .then((val: Response) => val.json())
}

export function randomNumber() {
  return performance.now() + performance.timeOrigin
}

export function randomFileName() {
  return randomNumber().toString(36);
}

export function writePrivateData(token: Token, type: string, source: string, name: string, content: any, indexData?: Record<string, any>, group?:string) {
  group = group ? group : "private";
  fetch(backendUrl + '/upload.php?' +  new URLSearchParams({
      username: token.username,
      group: group,
      type: type,
      source: source,
      name: name,
      token: token.token,
      content: JSON.stringify(content, null, "\t"),
      idx_data: indexData ? JSON.stringify(indexData, null, "\t") : "",
    }), {
    method: 'POST',
    headers: {
    }
  }).then((val)=> console.log(val.text()));
  return group + "/" + source + "/" + name
}

interface ServerApiIndex{
  file: string;
}

export async function readPrivateIndex<T extends ServerApiIndex>(group: string, token?: Token) {
  if (!token) {
    return [];
  }
  const data = (await readPrivateData(token, group, "_index") as T[]).map((val: T) => {
    return {
      ...val,
      idx: {
        name: val.file,
        group: "private",
        source: group,
      }
    };
  });
  return data;
}

async function loadPrivatePublic<T>(privateGroup: string, group?: string, source?: string, name?: string, token?: Token) {
  if (source && name) {
    if (group === "public") {
      return (await getJson(source, name)) as T;
    }
    else if (group === "private" && token) {
      return (await readPrivateData(token, privateGroup, name)) as T;
    }
  }
  throw Error("Could not fetch Character")
}

export async function loadCharacter(group?: string, source?: string, name?: string, token?: Token) {
  return loadPrivatePublic<Character>("mobs", group, source, name, token);
}

export async function loadSpell(group?: string, source?: string, name?: string, token?: Token) {
  return loadPrivatePublic<Spell>("spells", group, source, name, token);
}

export async function parallel<T>(funcs: [string, Promise<T>][], callback: (key: string, val: T)=>void) {
  for (const [key, val] of funcs) {
    callback(key, await val);
  }
}