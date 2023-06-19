import json
import os

with open("en.json", "r") as real:
    real = json.loads(real.read())
    newer = {}
    for key in real.keys():
        print(key + "\n")
        obj = {}
        for key2 in real[key]:
            if "str" in str(type(key2)):
                new_input = input(f"{key2}>>>")
                obj[key2] = str(new_input)
            else:
                obj[key][key2] = {}
                for key3 in real[key][key2]:
                    new_input = input(f"{key3}>>>")
                    obj[key][key2] = str(new_input)
        newer[key] = obj
    with open("lang.json", "w") as real2:
        converted = json.dumps(newer)
        real2.write(converted)
