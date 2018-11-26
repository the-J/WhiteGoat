# WhiteGoat - Discord bot - development

### Stack
    - nodejs
    - postgres with sequelize
    
</a>
Test bot was not authorized on twitch.tv API during recording

![WhiteGOatBot](./WhiteGoatBot.gif)
    
### Developers note (to be expanded)

Twitch component works but it lacks in some places. Whats needs to be done next:
- tMine message should be handled by different DB table:
    - there should be table of users that would be updated by tAddMe message to store twitchChannel.id 
- well, I need to handle postgres promise rejections better and probably optimize db read/write methods. It was my first tmie with postgres and I think I can do better. 

### About

I use [discord](https://discordapp.com/) extensively. I use it with clients for **freelance projects**, for communication 
with friends, for github repository webhooks and **other personal cases**. And after digging around I came to a conclusion that:
    
- I won't trust any available bot on my servers;
- There is no bot that will suit my needs. 

<a/>
And so I need to build my own one. 

#####I need a few things:

- Handle followed twitch channels DONE - (that's where I'm gonna start - learning purposes)
- Setup calendar reminders with option of assigning users
- **RUN HIM ON RASPBERRY-PI with armv7 processor**
- Who knows what more...

</a>
Oryginaly I wanted to use MongoDB but it does not support amrv7, that's why I have postgres 
(which supports almost any RaspberryPi processor)

#### What I'm building (what bot should do):
    stage 1: Handling Twitch.tv (done)
    - [x] Register new twitch channels that it will follow
    - [X] Setup channels on which it should publish
    - [x] Assign users to twitch stream notification list
    - [X] Publish info if twitch channel is live
    - [ ] Allow to assign users as bot admins
</a>
    
    stage 2: Calendar
    - [ ] Setting reminders
    - [ ] Assign users reminder
    - [ ] Setting reminders to other users
    - Who knows what more
</a>

#### Setup

- postgres should be running on your system;
- Remove '.example.' from all files in credentials and fill info inside them
- options:    
    - development ```npm run dev``` will do the job in repos directory;
    - production in this directory ```npm run production``` (simple webpack builds without packaging node_modules)
    - production outside this dir: copy package.json and ./dist/build/bundle.js to selected folder && ```npm run prod``` (this script could be nicer, I know)
- With docker:
    - DOCKER DOES NOT WORK! I GIVE UP! (any pull request will be helpful)

</a>
I won't be handling any lack of credentials for now.

####Manual (current)
Bot is not creating any roles (for now) so only owner gets admin permissions.
I'll extend him later (handling role assignment as so on). 
Bot should run only on one server (maybe I'll change tat later).

    Twitch commands manual 
     NOTE 
     - commands are not case sensitive; 
     - remember about the prefix:   prefix   
     - params: [] - is required; () - is optional; else - doesn\t take params 
    
     COMMANDS 
     * tMan - this manual; 
     * tChannels - list of twitch saved channels; 
     * tAdd [chanel name] (message) - twitch stream listener; 
     * tAddMe [chanel name] - will notify you when selected twitch chanel goes live; 
     * tRemoveMe [chanel name] - ~tAddMe; 
     * tRemoveMeAll - removes your tag from every twitch chanel; 
     * tMine - channels that will notify you; 
     
     OWNER RESTRICTED  
     * tRemove [chanel name] - channels that will notify you;  
     * tStart - start twitch listener;  
     * tStop - stop twitch listener;  
     * setChanelId [#chanelName]- sets chanel on which bot will respond
     * update - needs to be called after bot settings where updated
