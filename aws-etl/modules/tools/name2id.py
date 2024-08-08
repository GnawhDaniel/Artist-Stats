# To execute this script please it run as module at the root directory.
# python -m modules.tools.name2id
#

from os import system, name
import requests
from modules.etl.extract import _get_spotify_token
import urllib
from colorama import Fore, Style
import boto3

def save(artists, filename):
    """
    Save artists into filename
    """
    # with open(filename, 'r') as file:
    #     print(set([i for i in file.readlines()]))
    with open(filename, 'w') as file:
        for artist in sorted(list(artists)):
            file.write(artist.strip()+'\n')


def clear_screen():
    # for windows
    if name == 'nt':
        _ = system('cls')
 
    # for mac and linux(here, os.name is 'posix')
    else:
        _ = system('clear')


def search(name, access_token, save_file="artists.txt"):
    query = urllib.parse.quote_plus(name)
    headers = {"Authorization": "Bearer " + access_token}
    
    user_input = "placeholder"
    offset = 0
    
    file = open(save_file, 'r')
    artist_to_save = set([artist.strip() for artist in file.readlines()])
    file.close()
    message = ""
    while user_input != "q":
        print("Artist Name -", name)
        api_url = f"https://api.spotify.com/v1/search?query={query}&type=artist&locale=en-US%2Cen%3Bq%3D0.5&offset={offset}&limit=20"
        res = requests.get(api_url, headers=headers, timeout=20).json()
                
        artist_id_list = []
        artist_name_list = []
        longest_name_length = min(max([len(i["name"]) for i in res["artists"]['items']]), 50)
        for index, item in enumerate(res['artists']["items"]):
            counter = ("{:<3}").format(str(index+offset))
            
            content = ""
            if item['id'] in artist_to_save:
                content += Fore.RED
            print(content, 
                    counter, 
                    item["id"], "{name:<{width}}".format(name=item["name"][:longest_name_length],width=longest_name_length), 
                    item['genres'], Style.RESET_ALL)
                
            
            artist_id_list.append(item["id"])
            artist_name_list.append(item["name"])
                
        print("Q - Close ", end="")
        if (index + offset + 1) % 20 == 0:
            print("\tN - Next Page ", end='')
        if (index + offset + 1) > 20:
            print("\tP - Previous Page ", end='')
        print("")
        
        print(Fore.RED + "* Red means artist is already in txt file *" + Style.RESET_ALL)

        user_input = input("Option [Default - 0]: ").lower().strip()
        if user_input == "":
            user_input = "0"
        
        if user_input == 'n' and (index+offset+1) % 20 == 0:
            offset += 20
        elif user_input == 'p' and (index+offset+1) > 20:
            offset -= 20
        elif user_input.isdigit():
            artist_id = artist_id_list[int(user_input)]
            artist_name = artist_name_list[int(user_input)]
            if artist_id in artist_to_save:
                message = Fore.RED + f"{artist_name} already exists in file!" + Style.RESET_ALL
            else:
                artist_to_save.add(artist_id)
                message = Fore.GREEN + "Added - " + artist_name + Style.RESET_ALL
            break
        clear_screen()
    save(artist_to_save, save_file)
    clear_screen()
    return message
            

if __name__ == "__main__":
    u_input = input("Artist Name: ").strip().lower()
    
    access_token = _get_spotify_token()
    save_to = "artists.txt"
    while u_input not in [""]:    
        clear_screen()
        message = search(u_input,access_token)
        print(message)
        u_input = input("Artist Name: ").strip().lower()
    
    save_to_s3 = input("Save to S3? Y-Yes/Any-No: ").strip().lower()
    if save_to_s3 in ['y']:
        client = boto3.client('s3')
        with open("artists.txt", 'rb') as f:
            res = client.put_object(
                Body=f,
                Bucket="us-east-2-misc",
                Key="artists.txt"
            )
            print(res)
        print("saved to s3")
    
    # f = open("artist_old.txt", 'r')
    # u_input = [i.strip() for i in f.readlines()] 
    # f.close()
    # access_token = _get_spotify_token()
    # for i in u_input:
    #     clear_screen()
    #     message = search(i, access_token)
    #     print(message)
        
    # clear_screen()