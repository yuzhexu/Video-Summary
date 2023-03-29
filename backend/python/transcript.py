# importing modules
import os
from youtube_transcript_api import YouTubeTranscriptApi

def extract_captions(video_id):
    # using the srt variable with the list of dictionaries
    # obtained by the .get_transcript() function
    srt = YouTubeTranscriptApi.get_transcript(video_id)
    
    return srt
    

def extract_video_id(url):
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
    return video_id


    
