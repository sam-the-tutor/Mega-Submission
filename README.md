# ICP Portfolio

A portfolio manager dapp built on the internet computer blockchain

![](./src/assets/Screenshot%20from%202024-02-18%2015-53-22.png)

## Background:

Tracking and managing crpypto assets on the ICP networks have been not a walk over.From managing different principal IDs generated whevenever you login to an application, to tracking all all the assets in those accounts. Most of the tools that offer managing accounts at the moment allow you to track indivivuals accounts at one at a time,which is not the best solution given the number of applications are increasing the number of applications in the ecosystem is increasing at a high pace. 
We propose, a new solution ICP Portifolio Dapp, an application that will solve most of the challenges that users have been facing when it comes to crypto management.

### How the application works.

- User logins in using their internet identity credentials.

![](./src/assets/Screenshot%20from%202024-02-18%2016-16-16.png)

- User is dircted to the dashboard where all the tokens held by their principal id and their relevant information can be seen

![](./src/assets/Screenshot%20from%202024-02-18%2016-05-08.png)

- Click on any of the tokens to see more information about the token and the how much each of your individual id holds in that token

![](./src/assets/Screenshot%20from%202024-02-18%2016-18-52.png)

- To add a new principal id, navigate to the settings page. When you add another principal Id, the application automatically fetches all the tokens held by that id, catculates their value using real market prices and re-calculates your portifolio data and statistics

![](./src/assets/Screenshot%20from%202024-02-18%2015-54-32.png)

- You can also set up email notifications for your principal Id for any token of your choice.
  You will receive an email wherenever there is an activity on your registered account(principal ids)
  ![](./src/assets/Screenshot%20from%202024-02-18%2015-55-14.png)

- Click on the `Send` button on the left sidebar to send tokens held by your principal id

![](./src/assets/Screenshot%20from%202024-02-18%2016-04-55.png)

- To recieve tokens, click on the `Receive` button on the sidebar to scan the qr code or copy the relevant address

![](./src/assets/Screenshot%20from%202024-02-18%2016-04-42.png)

### Upcoming features.

- We are already developing a no-code launch pad for both ICP and the bitfinity network.Users will be able to create and launch their tokens and nfts on the two networks w
  ![](./src/assets/Screenshot%20from%202024-02-18%2016-05-19.png)

- Staiking, Automated swapping, and trading bots features

![](./src/assets/Screenshot%20from%202024-02-18%2016-18-52.png)

- Adding support for NFTS, users should be able to see all the nfts held by their different accounts.

- An inscriptions explorer,where users can see the inscriptions held by their principal ids(example is bioniq)

### How to run the project locally

- Clone the github repo

```
git clone https://github.com/sam-the-tutor/ICP-Portfolio
```

- Install the dependecies

```
npm install
```

- run the deploycanisters.sh file inside the scripts folder to deploy the canisters

```
./scripts/deploycanisters.sh
```

- start the server

```
npm start
```

Project should be accessible on the localhost:3000

### Licence

MIT
