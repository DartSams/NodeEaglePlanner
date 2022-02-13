from channels.consumer import SyncConsumer
from .models import Job,Note
import json

class EchoConsumer(SyncConsumer):
    def websocket_connect(self,event):
        print("connect event is on")
        print(event)
        self.send({
            'type':'websocket.accept'
        })

    def websocket_receive(self,event):
        event = event['text'].split(",")
        # print(event)
        if event[0] == 'add new task':
            new_task = Job(user=event[1],user_id=event[2],task=event[3],due_date=event[4],status="active")
            new_task.save()
            # print(f"***Creating new task: {event}***")

        elif event[0] == 'delete task': #setup later to delete task
            try:
                task=Job.objects.filter(task=event[1],user_id=event[5],due_date=event[2],status=event[3])
                task.delete()
                # print(f"***deleting task where task is {event[1]} by {event[2]}***")
            except:
                print("delete failed")

        elif event[0] == 'finished editing task': #edits the current task
            # print(event)
            task = Job.objects.filter(user=event[4],user_id=event[5],task=event[1],due_date=event[2],status=event[3])
            task.update(user=event[9],user_id=event[10],task=event[6],due_date=event[7],status=event[8])
            #task.update is faster because it performs 1 query and auomatically saves update https://stackoverflow.com/questions/2712682/how-to-select-a-record-and-update-it-with-a-single-queryset-in-django
            # print(f"***editing task where task is {event[1]} by {event[2]}***")

        elif event[0] == 'add new note':
            # print(event)
            # print(f"***Creating new note: {event}***")
            note_message = Note(user=event[1],user_id=event[2],note_message=event[3],note_tag=event[4])
            note_message.save()

        elif event[0] == 'delete note': #deletes note
            # print(event)
            if "<br>" in event[3]:
                note=event[3].replace("<br>","\n") #this replaces the html <br> with python's version of line skip breaks which is \n
            else:
                note=event[3]
            try:
                n=Note.objects.filter(user=event[1],user_id=event[2],note_message=note)
                n.delete()
                # print(f"***deleting note where note is {event[3]} by {event[1]}***")
            except:
                print("delete failed")

        elif event[0] == "finished editing note": #updates note in db according to logged in user,note and note_tag
            # print("editing note")
            # print(event)
            try:
                task = Note.objects.filter(user=event[1],user_id=event[2],note_message=event[3],note_tag=event[4])
                task.update(user=event[1],user_id=event[2],note_message=event[7],note_tag=event[8])
            except:
                print("failed editing note")


    def websocket_disconnect(self,event):
        print("connection is disconnected")
        print(event)

        