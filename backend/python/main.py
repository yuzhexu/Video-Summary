from transcript import extract_captions, extract_video_id

import argparse
import json
import tiktoken


#split each
def split_token(tokens, chunk_size):
    tokenlist = [tokens[i:i + chunk_size] for i in range(0, len(tokens), chunk_size)]
    return tokenlist

def main(args):
    #data = download_captions(extract_video_id("https://www.youtube.com/watch?v=kpnJZZxqZHQ"))
    data = extract_captions(extract_video_id(args.url))
    
    encoding = tiktoken.encoding_for_model("text-davinci-003")  
    
    
    #concat all text and remove newline characters
    text = ""
    for text_i in data:
        text = text + text_i["text"] + " "
    text = text.replace("\n", "").replace("... ...", " ").replace("...", "")
    
    encoded_tokens = encoding.encode(text)
    tokens_list = split_token(encoded_tokens, 3500)
    
    text_list = []
    for tokens in tokens_list:
        text_list.append(encoding.decode(tokens))
    
    
    
    
    
    
    jsonStr = json.dumps(text_list)
    print(jsonStr)
    
    
    

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('url', type=str, help='youtube url')
    args = parser.parse_args()
    main(args)