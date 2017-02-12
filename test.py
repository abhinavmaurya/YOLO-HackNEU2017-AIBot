import argparse
import base64
import httplib2
import webbrowser
import unirest
import urllib
import webcolors
import requests
import shutil
import sys

from googleapiclient import discovery
from oauth2client.client import GoogleCredentials

# The url template to retrieve the discovery document for trusted testers.
DISCOVERY_URL = 'https://{vision}.googleapis.com/$discovery/rest?version={apiVersion}'  # noqa
# [END import_libraries]


def classify(photo_file):
    """Run a label request on a single image"""

    # [START authenticate]

    API_DISCOVERY_FILE = 'https://vision.googleapis.com/$discovery/rest?version=v1'
    http = httplib2.Http()

    credentials = GoogleCredentials.get_application_default().create_scoped(
        ['https://www.googleapis.com/auth/cloud-platform'])
    credentials.authorize(http)

    service = discovery.build('vision', 'v1', http, discoveryServiceUrl=API_DISCOVERY_FILE)
    # [END authenticate]

    # [START construct_request]
    with open(photo_file, 'r', buffering=1) as image:
        image_content = base64.b64encode(image.read())
        service_request = service.images().annotate(body={
            'requests': [{
                'image': {
                    'content': image_content.decode('UTF-8')
                },
                'features': [{
                    'type': 'LABEL_DETECTION',
                    'maxResults': 1
                }]
            }]
        })
        # [END construct_request]
        # [START parse_response]
        response = service_request.execute()
        #print(response)
        labels = []
        for results in response['responses']:
            if 'labelAnnotations' in results:
                for annotations in results['labelAnnotations']:
                    # print('Found label %s, score = %s' % (annotations['description'], annotations['score']))
                    labels.append(annotations['description'])
        #print(labels)
        return labels
        # [END parse_response]

def websearch(url):
    def closest_colour(requested_colour):
        min_colours = {}
        for key, name in webcolors.html4_hex_to_names.items():
            r_c, g_c, b_c = webcolors.hex_to_rgb(key)
            rd = (r_c - requested_colour[0]) ** 2
            gd = (g_c - requested_colour[1]) ** 2
            bd = (b_c - requested_colour[2]) ** 2
            min_colours[(rd + gd + bd)] = name
        return min_colours[min(min_colours.keys())]

    def get_colour_name(requested_colour):
        try:
            closest_name = actual_name = webcolors.rgb_to_name(requested_colour, 'html4')
        except ValueError:
            closest_name = closest_colour(requested_colour)
            actual_name = None
        return actual_name, closest_name

    def simplify_color(hex_value):
        requested_colour = webcolors.hex_to_rgb(hex_value)
        actual_name, closest_name = get_colour_name(requested_colour)
        return closest_name

 #   url = raw_input('Enter your image url: ')
    r = requests.get(url, stream=True)
    if r.status_code == 200:
        #print("heyya")
        with open("img.jpg", 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
##    try:
##        r = requests.get('http://www.koreanfashionista.com/wp-content/uploads/2013/01/blue-bags.jpg', stream=True)
##        if r.status_code == 200:
##            print("heyya")
##            with open("img.jpg", 'wb') as f:
##                r.raw.decode_content = True
##                shutil.copyfileobj(r.raw, f)
##        with open("img.jpg", 'wb') as f:
##            keyword = classify(f)
##        #print(keyword)
##    except:
##        keyword = ""
    
    keyword = classify("img.jpg")
##    url = "http://www.koreanfashionista.com/wp-content/uploads/2013/01/blue-bags.jpg"
##    url = url.replace("/", "%2F")
##    url = url.replace(":", "%3A")
##    getUrl = "tag-url.json?palette=precise&sort=relevance&url="
##    getUrl = getUrl + url

    # These code snippets use an open-source library. http://unirest.io/python
    response = unirest.post("https://apicloud-colortag.p.mashape.com/tag-file.json",
         headers={
           "X-Mashape-Key": "xiKGNKERDkmshnf4B5KAy6HFBqpMp1gx4stjsnnrb0A9OFtAPt"
         },
     params={
       "image": open("img.jpg", mode="r"),
       "palette": "simple",
       "sort": "weight"
         }
    )

    validColors = ["Black", "Grey", "White", "Off-white", "Beige", "Brown", "Metallic", "Purple", "Blue", "Green", "Yellow", "Orange", "Pink", "Red"]
    validColors2 = ["black", "grey", "white", "off-white", "beige", "brown", "metallic", "purple", "blue", "breen", "yellow", "orange", "pink", "red"]

    def returnReccomendations(keyword, color):
        #print(keyword)
        pre = "http://shop.nordstrom.com/sr?origin=keywordsearch&contextualcategoryid=0&keyword="
        prefix = pre + keyword[0] + "&color=%27"
        
        if color == "gray":
            color = "grey"
        post = "%27"
        if color in validColors or color in validColors2:
            website = prefix + color + post
        else:
            website = pre + color + "+" + keyword[0]
        #print(website)
        return website

    #print(type(response.body))
    #print(response.body)
    if keyword and response.body:
        #print(response.body)
        color = response.body["tags"][0]["label"]
        #print(color)
        if color in validColors:
            return  returnReccomendations(keyword, color)
        else:
            return returnReccomendations(keyword, simplify_color(response.body["tags"][0]["label"]))
    else:
        return "http://shop.nordstrom.com/?origin=tab-logo"

   


if __name__ == '__main__':
    print(websearch(sys.argv[1]))
    sys.stdout.flush()
    
    
