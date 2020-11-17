# TrackView

The goal of TrackView is to show the information gathered by Footstep.
## Technologies

This application is based on Angular and for the data visualization uses D3.js. The interaction between this application and Footsteps occurs via Neo4j, which is accessed on a service. 

# Execution

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Organization

There are 3 main parts, the charts components, the dashboards components and the services. All parts can be found under the path src\app\. 
The charts have the prefix 'chart-' before their name so it’s easy to find them, to use one is necessary to add his tag to the html of the desired component, and pass on this tag the data, which is an array were each position represents an different object, for example: the bullet chart data's look like this: ["Obj1",10],["Obj2",12]. Every chart has its particularities, so is necessary pass different values.
The dashboards components, also uses a prefix, their prefix is 'dash-', to use them it's necessary to add to the router component and to the nav component. Every dashboard component makes the necessary adjustment to the data in order to pass to the charts. 
Last there's the services, which are responsible for getting the data, and transforming into an array of object so it's easy to the dashs manipulate.  

*Also important on data/configs.json is the configurations of the dashboards, every label that appear is from there, so if it's necessary a change to the labels it need to happen there. 

## Possible improvements

First: add more interaction to the charts, it's only possible to access them by the menu now, but javascript allow to add listeners so the final user can click on them and be redirect to another dashboard.
Second: change the main structure of the dashs, right there's some repetition on the codes, if is introduced something like a polymorphism, it will make it better. 
Third: filters, when I made the system there were only few logs, so the graphs use all the time available instead of using different options of time.


