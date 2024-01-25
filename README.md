Thanks for being interested in integrating with COMPUTERS - an addon by Jigarbov Productions! We are planning many more features such as email blasts and more, but for now, here’s the instructions on how to be added to the analysis module.

# TLDR Checklist:
### Create your scoreboard objective, ensure your unique namespace + :jig_computer.addon_stats
/scoreboard objectives add studioname_packname:jig_computer.addon_stats dummy
### Update your fake player scores on that objective when something cool happens
/scoreboard players add “studioname_packname:specific_stata“ “studioname_packname:jig_computer.addon_stats” 1
/scoreboard players add “studioname_packname:specific_statb“ “studioname_packname:jig_computer.addon_stats” 1
or in scripting
world.scoreboard.getObjective('studioname_packname:jig_computer.addon_stats')?.addScore('studioname_packname:specific_stata', 1);
world.scoreboard.getObjective('studioname_packname:jig_computer.addon_stats')?.addScore('studioname_packname:specific_statb', 1);
...(as many as you want)
### Populate your .lang file contents:
studioname_packname:jig_computer.addon_stats=Addon Name Stats
studioname_packname:specific_stata=Cool Stat Name
studioname_packname:specific_statb=Another Cool Stat!
studioname_packname:credits.for.computers=Addon Name is by Studio Name.

## Validator
Test your integration by running this validator addon at the same time as your addon and run this command:
/function jig/comp_validator/test

If an error shows up something is wrong. check that your objective name ends in jig_computer.addon_stats
If your entries are not translated, check your lang file in your resource pack

# HERE'S THE LONG VERSION:
Add a scoreboard objective on world load, usually added in an initiator function.
/scoreboard objectives add studioname_packname:jig_computer.addon_stats dummy
For my studio and addon it might look like:
/scoreboard objectives add jig_atw:jig_computer.addon_stats dummy

### The “jig_computer.addon_stats” is important, this will be used as a way for our computers to identify scoreboards that can be used with our computers.

Make sure studioname_packname:jig_computer.addon_stats is translated in your lang file:
studioname_packname:jig_computer.addon_stats=
Mine would look like:
jig_atw:jig_computer.addon_stats=ALL THE WOOL Stats

Then add your stats as fake player names to that objective that you think players might find interesting! Add as many stats as you like!
/scoreboard players add “studioname_packname:specific_stat“ “studioname_packname:jig_computer.addon_stats” 1
For example, in my “ALL THE WOOL” addon I have balloons. Each time one pops I will add a score to my stats objective. You can add as many as you like, and name them whatever you like as long as you add them to your lang file.
/scoreboard players add “jig_atw:balloon_pop“ “jig_atw:jig_computer.addon_stats” 1

This can also be done on the scripting side. Basically any action which you think would be fun to measure.

Then you also need to make sure “studioname_packname:specific_stat” is added to your lang file
studioname_packname:specific_stat=
jig_atw:balloon_pop=Balloons Popped

We want to credit and promote you!
Add one more line to your lang file:
studioname_packname:credits.for.computers=
jig_atw:credits.for.computers= Stats provided by ALL THE WOOL addon by Jigarbov Productions.

We will add it to the bottom of your stats page, so don’t forget!


# FAQs
###How do we register our scoreboard objective with your computers?
You don’t need to do anything. We will see the objective with the specific name (jig_computers.addon_stats) and pull it into the drop down list automatically.

### What if computers isn’t installed and it gets installed after my addon?
By making your scoreboard objective and adding scores to it, it will tick up in the background even without computers. Then if computers is added, it will automatically pull the scoreboard.

### Can I add multiple objectives?
No. One objective per addon. You can add as many fake player names to that objective as you like though! Load it with fun stats about your addon!

### How long can my statistics titles be?
As long as you want, really. If you want to put a little more description like “Keyboards tapped (this is obtained by tapping keyboards)” you can do that.

### How long can my credit be?
Keep it short, but feel free to shout out your contact information just as you would in your own content. It will be going through regular content review so normal content review rules apply.

### Isn’t this just a fancy scoreboard?
Yes, if players want they can still setdisplay the scoreboard without computers. But for many addons, this wouldn’t make a lot of sense in the feature set. Supporting “Computers” allows your addon to do what it does best by doing exactly what you want it to do and not be bogged down with random stuff like how to manage showing/hiding a scoreboard, and allows mine to do what it does best by showing these stats in a way that is fun and in the context of my addon. They are both better as a result!I am also planning extended functionality like being able to hook into our email systems and more.

### How do I test that it’s working?
You can validate all your lang files simply by displaying your scoreboard on the sidebar and making sure all your lang translations show up instead of your rawtext by doing:
“/scoreboard objectives setdisplay sidebar studioname_packname:jig_computer.addon_stats”
On submission CR already have the lang file which they go through so it shouldn’t need a specific callout.
