from bs4 import BeautifulSoup
import requests
import os

# with open("tools/youtube_urls.txt", 'r') as f:
#     for url in f.readlines():
#         url = url.strip()
#         html = requests.get(url).text
#         soup = BeautifulSoup(html, "html.parser")
#         meta_tag = soup.find('meta', attrs={"itemprop": "identifier"})
#         channel_id = meta_tag["content"]
#         print(channel_id)

while True:
    url = input("URL: ").strip()
    url = url.strip()
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    meta_tag = soup.find('meta', attrs={"itemprop": "identifier"})
    channel_id = meta_tag["content"]
    os.system(f"echo -n '{channel_id.strip()}' | xclip -selection clipboard")