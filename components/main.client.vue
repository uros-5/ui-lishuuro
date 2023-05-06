import os
input_ = ""
default_txt = "<template>\n<p>hello world</p>\n</template>\n<script setup lang='ts'>\n\n</script>\n<style>\n\n</style>"
while True:
    input_ = input("File name>>> ")
    if input_ == "ok":
        break
    with open(f'{input_}.vue', "w") as file:
        file.write(default_txt)
