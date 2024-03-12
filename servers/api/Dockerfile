FROM node:21-alpine3.18 as base
#update & upgrade OS
RUN apk update
RUN apk upgrade
#set dev env
FROM base as development
ENV NODE_ENV=development

#set workdir & copy package.json
WORKDIR /opt/project
COPY src/api .

#install npm and nodemon and package.json
RUN npm install --verbose
RUN npm install -g nodemon --verbose



#Start npm dev
CMD ["npm", "run", "dev" ,"-ddd"]



