from requests import get
from json import loads, dump
from re import sub
from bs4 import BeautifulSoup
from numpy import base_repr
from os import system

system("rm *.json")


skills = {
  "athletics": "str",
  "acrobatics": "dex",
  "sleight of hand": "dex",
  "stealth": "dex",
  "arcana": "int",
  "history": "int",
  "investigation": "int",
  "nature": "int",
  "religion": "int",
  "animal Handling": "wis",
  "insight": "wis",
  "medicine": "wis",
  "perception": "wis",
  "survival": "wis",
  "deception": "cha",
  "intimidation": "cha",
  "performance": "cha",
  "persuasion": "cha"
}

data = loads(get("https://gist.githubusercontent.com/tkfu/9819e4ac6d529e225e9fc58b358c3479/raw/d4df8804c25a662efc42936db60cfbc0a5b19db8/srd_5e_monsters.json").content)

def removeNonNumeric(str):
    return sub("[^0-9]", "", str) 

def readSimpleIntData(out, outkey, data, key):
    out[outkey] = int(data[key])

def readAtributes(out, data):
    attributes = ["STR", "DEX", "CON", "INT", "WIS", "CHA"]
    for attribute in attributes:
        readSimpleIntData(out, attribute.lower(), data, attribute)

def reacChalange(out, data):
    (cr, xp, _) = data["Challenge"].split(" ")
    out["cr"] = cr.strip()
    out["xp"] = int(removeNonNumeric(xp))

def readMeta(out, data):
    m1, alignment = data["meta"].split(", ")
    out["alignment"] = alignment

    size, type = m1.split(" ")
    out["size"] = size
    out["type"] = type

def readAC(out, data):
    out["ac"] = int(removeNonNumeric(data["Armor Class"]))
    out["Armor_Class"] = data["Armor Class"]

def readHp(out, data):
    hp, hpgen = data["Hit Points"].split(" ", 1)
    out["hp"] = int(hp)
    out["hp_gen"] = hpgen[1:-1]

def readPropertyListWithPostprop(data, postprop):
    json = {}
    for skill in data.split(","):
        [s, mod] = postprop(skill.strip()).strip().rsplit(" ",1)
        json[s.lower()] = int(mod)
    return json

def readPropertyList(data):
    return readPropertyListWithPostprop(data, lambda x: x)

def toMod(val):
    return (val-10)//2

def readList(data, key):
    if key in data:
        cond = data[key].split(";")
        return [x.strip()  for x in cond[0].split(",")] + [x.strip() for x in cond[1:]]
    return []

def readConditionImunitis(out, data):
    out["condition_immunities"] = readList(data, "Condition Immunities")

def readDamageImunitis(out, data):
    out["damage_immunities"] = readList(data, "Damage Immunities")

def readDamageResistances(out, data):
    out["damage_resistances"] = readList(data, "Damage Resistances")

def readDamageVulnerability(out, data):
    out["damage_vulnerabilities"] = readList(data, "Damage Vulnerabilities")

def readSkills(out, data):
    if "Skills" in data:
        availableSkills = readPropertyList(data["Skills"])
        gen = {}
        for skill, mod in availableSkills.items():
            gen[skill] =  mod - toMod(out[skills[skill]])
        out["skills"] = gen
    else:
        out["skills"] = []

def readSavingThrows(out, data):
    if "Saving Throws" in data:
        out["saving_throws"] = readPropertyList(data["Saving Throws"])
    else:
        out["saving_throws"] = []

def tidyHTML(html: str):
    if (html.startswith("<div>")) :
        html = html[5: -6]
    if (not html.startswith("<p>")):
        html = "<p>" + html + "</p>"
    return html

def getTraits(out, data):
    traits = []
    if ("Traits" in data):
        html = tidyHTML(data["Traits"])
        soup = BeautifulSoup(html, "html.parser")

        for child in soup.children:
            strongs = child.find_all(lambda tag: tag.name == "strong")
            if len(strongs) == 0:
                traits[-1]["description"] += "<br/><br/>" + child.find(text=True, recursive=False).strip()
                continue

            name = strongs[0].get_text().strip()[:-1]
            description = child.find(text=True, recursive=False).strip()
            traits.append({
                "name": name,
                "description": description
            })
    out["traits"] = traits

def getActions(out, data):
    actions = []
    if ("Actions" in data):
        html = data["Actions"]
        soup = BeautifulSoup(html, "html.parser")

        for child in soup.children:
            parts = str(child).split("</strong>", 1)
            if (len(parts) == 1):
                actions[-1]["description"] += "<br/><br/>" + parts[0][3:-4]
                continue
            name = parts[0][15:-1].strip()
            description = parts[1][5:-4].strip()
            actions.append(
                {
                "name": name, "description": description
                }
            )
    out["actions"] = actions

def getLegendaryActions(out, data):
    actions = []
    out["legendary_description"] = ""
    if ("Legendary Actions" in data):
        html = data["Legendary Actions"]
        soup = BeautifulSoup(html, "html.parser")
        first = True

        for child in soup.children:
            if first:
                first = False
                out["legendary_description"] = str(child)[3:-5]
                continue
            parts = str(child).split("</strong>", 1)
            if (len(parts) == 1):
                actions[-1]["description"] += "<br/><br/>" + parts[0][3:-4]
                continue
            name = parts[0][15:].strip()
            description = parts[1][5:-4].strip()
            actions.append(
                {
                "name": name, "description": description
                }
            )
    out["legendary_actions"] = actions

def readMythic(out, data):
    out["mythic_actions"] = []

def readLair(out, data):
    out["lair_actions"] = []

def readRegional(out, data):
    out["regional_actions"] = []

index = []

def processData(data):
    #with open("_tmp.json", "w") as file:
    #    dump(data, file, sort_keys=True, indent="\t")
    out = {}
    out["name"] = data["name"]
    out["speed"] = data["Speed"].strip()
    out["senses"] = data["Senses"]
    out["languages"] = data["Languages"]
    
    reacChalange(out, data)
    readMeta(out, data)
    readAtributes(out, data)
    readAC(out, data)
    readHp(out, data)
    readSkills(out, data)
    getTraits(out, data)
    getActions(out, data)
    getLegendaryActions(out, data)
    readSavingThrows(out, data)
    readConditionImunitis(out, data)
    readDamageImunitis(out, data)
    readDamageResistances(out, data)
    readDamageVulnerability(out, data)
    readMythic(out, data)
    readLair(out, data)
    readRegional(out, data)

    name = base_repr(len(index), 36)

    filename = name
    with open(filename + ".json", "w") as file:
        dump(out, file, sort_keys=True, indent="\t")
    
    index.append({
        "name": out["name"],
        "cr": out["cr"],
        "size": out["size"],
        "alignment": out["alignment"],
        "type": out["type"],
        "file": filename
    })

for mob in data:
    processData(mob)

with open("_index.json", "w") as file:
    dump(index, file, sort_keys=True, indent="\t")
