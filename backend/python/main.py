from transcript import extract_captions, extract_video_id

import argparse
import json




def main(args):
    #data = download_captions(extract_video_id("https://www.youtube.com/watch?v=kpnJZZxqZHQ"))
    data = extract_captions(extract_video_id(args.url))
    
    
    
    
    
    jsonStr = json.dumps(data)
    print(jsonStr)
    
    
    

if __name__ == "__main__":
    
    parser = argparse.ArgumentParser()
    parser.add_argument('url', type=str, help='youtube url')
    args = parser.parse_args()
    main(args)