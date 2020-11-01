# OSCalc

*You ever just come back from your first ever Shadowrun session, annoyed at the lack of digital tools, and then slap something together at like 3AM?*

*Well.*

The result is a simple tool to keep track of your overwatch score while hacking as a decker in Shadowrun 6e. It continually tells you how many rounds remain until GOD smites you. You can track number of opposed hits and programs used, as well as any hosts you hack into. Other calculations or modifiers should be tracked by hand. Designed for mobile use.

## What it tracks

* Number of opposed hits
* Number of illegal programs used
* Overwatch score for hosts with illegal access, both admin and user
* A few notes about active hosts
* Rounds remaining until GOD smites thee (score of 40)
* Maybe more in the future when I learn about it?

## How to use

* Raise or lower the number of hits/programs by pressing the buttons on each side
* Add new hosts you've gained (illegal) access to by clicking either "Add Admin" or "Add User". You can enter a name and a quick note if you'd like to, but it's not required.
* You can remove hosts by pressing the "EXIT HOST" button on the corresponding card. This removes the card and stops actively counting OS from it each round. Any OS you've already gained from this host is retained.
* Press the "New round" button when it's... a new round. Doing this locks in anything you were doing earlier, and increases the OS according to the number of active hosts you have illegal access to.
* To reset the tracker, press both of the "CONFIRM" buttons and then the "REBOOT CYBERDECK" button. This wipes everything.
* If you install backdoors or need to retain other important info, write it down on paper or in a notes app.

## Disclaimer

* Probably some bugs. I made this mainly for personal use, so it might behave in unexpected ways for you.
* If your party's survival depends on this hack, maybe keep track of it by hand as well.
* The tracker saves data automatically in your browser's local storage, so everything *should* still be there if you close the website or the browser. Unless you delete your browser history or use incognito mode, of course. 
* It only stores text in your browser's local storage. This is variables with numbers and info about hosts. No tracking or anything, except maybe from github which it's hosted at, dunno.

## License

Pls no steal this very important code, thanks

## Acknowledgments

* The [glitch](https://codepen.io/pgalor/pen/OeRWJQ) effect from [here](https://1stwebdesigner.com/trippy-css-distortion-effects/).
