# importing modules
import os
from youtube_transcript_api import YouTubeTranscriptApi

def download_captions(video_id, save_path):
    # using the srt variable with the list of dictionaries
    # obtained by the .get_transcript() function
    srt = YouTubeTranscriptApi.get_transcript(video_id)

    # creating or overwriting a file with video_id as the name
    file_path = os.path.join(save_path, f"{video_id}.txt")
    with open(file_path, "w") as f:
        # iterating through each element of list srt
        for i in srt:
            # writing each element of srt on a new line
            f.write("{}\n".format(i))

def extract_video_id(url, save_path="./subtitles"):
    video_id = None
    # Check if the URL is a valid YouTube video URL
    if 'youtube.com/watch?v=' in url or 'youtu.be/' in url:
        # Extract the video ID from the URL
        if 'youtube.com/watch?v=' in url:
            video_id = url.split('youtube.com/watch?v=')[1]
        elif 'youtu.be/' in url:
            video_id = url.split('youtu.be/')[1]
        # Strip any extra parameters from the video ID
        video_id = video_id.split('&')[0]
        video_id = video_id.split('?')[0]
        # Set the save path to ./subtitles folder
        save_path = os.path.abspath(save_path)
        if not os.path.exists(save_path):
            os.makedirs(save_path)
        download_captions(video_id, save_path)
    return video_id

if __name__ == "__main__":
    url = input("Enter a YouTube video URL: ")
    extract_video_id(url)
