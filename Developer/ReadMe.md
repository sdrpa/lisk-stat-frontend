./node_modules/corsproxy-https/bin/corsproxy

sudo npm -g i webpack
webpack --progress

sudo cp dist/* /var/www/html/bittrex/

sudo ufw allow 8182