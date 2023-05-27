clear
yarn build
mv build denanu-dnd
tar -czf denanu-dnd.tar.gz denanu-dnd
scp denanu-dnd.tar.gz ubuntu@wandhoven.ddns.net:/media/B/html/RPG/
rm denanu-dnd.tar.gz
ssh ubuntu@wandhoven.ddns.net "
cd /media/B/html/RPG; 

mkdir _tmp
sudo mv denanu-dnd/server_backend/data/.htaccess _tmp
sudo mv denanu-dnd/server_backend/data/login _tmp
sudo mv denanu-dnd/server_backend/data/files _tmp
sudo mv denanu-dnd/publicResources _tmp


sudo rm -r denanu-dnd; 
tar -xzf denanu-dnd.tar.gz; 

sudo rm -r denanu-dnd/server_backend/data/login
sudo rm -r denanu-dnd/server_backend/data/files
sudo rm -r denanu-dnd/publicResources
sudo mv _tmp/publicResources denanu-dnd
sudo mv _tmp/login denanu-dnd/server_backend/data 
sudo mv _tmp/files denanu-dnd/server_backend/data

sudo rm -r _tmp

rm denanu-dnd.tar.gz; 

cd denanu-dnd;
mv htaccess .htaccess; 

cd server_backend;
mv htaccess .htaccess;

cd data; 
sudo chmod -R 777 files login ../../publicResources; 
sudo chown -R ubuntu:ubuntu files login ../../publicResources; 
mv htaccess .htaccess"
rm -r denanu-dnd
