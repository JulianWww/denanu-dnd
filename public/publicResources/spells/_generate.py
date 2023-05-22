from requests import get
from json import loads, dump
from numpy import base_repr
from os import system
from re import sub

system("rm *.json")

data = loads(get("https://gist.githubusercontent.com/JulianWww/5c3a49fda3614025791c49a1119f484c/raw/cc66d191462ba51520b12761fe54a6607aabf141/Dnd%25205E%2520Spell%2520List").content)

index = []

def getTime(s: str):
  return int(sub(r'[^0-9]', '', s))

for (idx, spell) in enumerate(data):  
  #with open("_tmp.json", "w") as file:
  #  dump(spell, file, indent="\t", sort_keys=True)

  components = {
    "verbal": False,
    "material": False,
    "somatic": False
  }
  for component in spell["components"]:
    if ("V" in component):
      components["verbal"] = True
    if ("M" in component):
      components["material"] = True
    if ("S" in component):
      components["somatic"] = True
  spell["components"] = components

  name = base_repr(idx, 36)

  ## Calc duration
  duration = spell["duration"]
  spell["duration"] = 0

  if duration == "Instantaneous":
    spell["duration_type"] = 0

  elif "Until dispelled" in duration:
    spell["duration_type"] = 4
  
  elif duration == "Special" or duration == "":
    spell["duration_type"] = 3
  
  elif "round" in duration or "rounds" in duration:
    spell["duration"] = getTime(duration)
    spell["duration_type"] = 2
  
  elif "day" in duration or "days" in duration:
    spell["duration"] = getTime(duration) * 86400
    spell["duration_type"] = 1
  
  elif "hour" in duration or "hours" in duration:
    spell["duration"] = getTime(duration) * 3600
    spell["duration_type"] = 1
  
  elif "minute" in duration or "minutes" in duration:
    spell["duration"] = getTime(duration) * 60
    spell["duration_type"] = 1
  
  
  else:
    print(duration, spell)
  



  index.append({
    "name": spell["name"],
    "lvl": spell["level"],
    "school": spell["school"],
    "ritual": spell["ritual"],
    "concentration": spell["concentration"],
    "source": spell["bookSource"],
    "file": name
  })

  with open(f"{name}.json", "w") as file:
    dump(spell, file, sort_keys=True, indent="\t")

with open("_index.json", "w") as file: 
  dump(index, file, sort_keys=True, indent="\t")