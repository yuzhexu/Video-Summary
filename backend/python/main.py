from transcript import extract_captions, extract_video_id

import argparse
import json
import tiktoken


def split_token(token, num_of_token):
  tokenlist = []
  counter = len(token)
  tokenlist.append(token[:num_of_token])
  tmp = token
  while counter > num_of_token:
    tmp = tmp[num_of_token:]
    tokenlist.append(tmp[:num_of_token])
    counter -= num_of_token
  return tokenlist

def main(args):
    #data = download_captions(extract_video_id("https://www.youtube.com/watch?v=kpnJZZxqZHQ"))
    data = extract_captions(extract_video_id(args.url))
    
    encoding = tiktoken.encoding_for_model("text-davinci-003")  
    text = ""
    for text_i in data:
        text = text + text_i["text"] + " "
    
    
    
    
    jsonStr = json.dumps(data)
    print(jsonStr)
    
    
    

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('url', type=str, help='youtube url')
    args = parser.parse_args()
    main(args)