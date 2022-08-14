from urllib import parse
import json
from bs4 import BeautifulSoup
import requests
from collections import defaultdict

# base vars
wikipediaBaseLink = 'wikipedia.org/wiki/'
wiktionaryBaseLink = 'wiktionary.org/wiki/'

# 1 = wikipedia
# 2 = people i admire
# 3 = wiktionary
# 4 = anything
link_type_to_get = 1

def get_links(type):
    input('did you check everything?')

    with open('./data/links.json', 'r') as f:
        links = json.load(f)

    if type == 1:
        with open('./assets/py/links_to_process.txt') as f:

            for i,line in enumerate(f.read().splitlines()):
                # clean mobile stuff
                if '?wprov=sfla1' in line:
                    line = line.replace('?wprov=sfla1','')
                
                # get language
                try:
                    lang = line.split('https://')[1][0:2].upper()
                except:
                    continue

                # get page name
                try:
                    page_name = parse.unquote(line).split('/wiki/')[1].replace('_',' ')
                except:
                    continue
                
                # get url elements after /wiki/
                try:
                    url_dir = line.split('/wiki/')[1]
                except:
                    continue

                # assemble and print elements
                links['wikipedia'][page_name] = f"{lang}_{url_dir}"

        with open('./data/links.json', 'w') as f:
            json.dump(links, f, indent=4, ensure_ascii=False)
    
    elif type == 2:
        with open('./assets/py/links_to_process.txt') as f:

            for i,line in enumerate(f.read().splitlines()):

                # print url
                print()
                print(line)

                # ask for name to input
                name = input(f'name for {line}: ')

                # save link
                links['people_i_admire'][name] = line

    elif type == 3:
        with open('./assets/py/links_to_process.txt') as f:
            
            for i,line in enumerate(f.read().splitlines()):
                
                # get language
                try:
                    lang = line.split('https://')[1][0:2].upper()
                except:
                    continue

                # get page name
                try:
                    page_name = parse.unquote(line).split('/wiki/')[1].replace('_',' ')
                except:
                    continue
                
                # get url elements after /wiki/
                try:
                    url_dir = line.split('/wiki/')[1]
                except:
                    continue

                # assemble and print elements
                links['wiktionary'][page_name] = f"{lang}_{url_dir}"
    
    elif type == 4:
        with open('./assets/py/links_to_process.txt') as f:

            for i,line in enumerate(f.read().splitlines()):

                # get site
                soup = BeautifulSoup(requests.get(line).text, 'html.parser')

                # get URL
                for title in soup.find_all('title'):
                    links['other_sites'][title.get_text()] = line 

    else:
        exit()

    with open('./data/links.json', 'w') as f:
            json.dump(links, f, indent=4, ensure_ascii=False)


# function to create json with list of random links
def random_links():

    # all links
    all_links = defaultdict(list)
    
    # get links
    with open('./data/links.json', 'r') as f:
        links = json.load(f)
    
    for key,link_list in links.items():
        
        for link in link_list.values():
            # wikipedia
            if key == 'wikipedia':
                all_links['links'].append(f"https://{link[0:2].lower()}.{wikipediaBaseLink}{link[3:]}")
            
            elif key == 'wiktionary':
                all_links['links'].append(f"https://{link[0:2].lower()}.{wiktionaryBaseLink}{link[3:]}")

            elif key == 'other_sites':
                all_links['links'].append(link)
    
    # dump json with the links
    with open('./data/random_links.json', 'w') as f:
        json.dump(all_links, f, indent=4, ensure_ascii=False)


# run function
get_links(link_type_to_get)
random_links()
