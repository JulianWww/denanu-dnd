clear
yarn build
mv build denanu-dnd
tar -czf denanu-dnd.tar.gz denanu-dnd
scp denanu-dnd.tar.gz ubuntu@wandhoven.ddns.net:/media/B/html/RPG/
rm denanu-dnd.tar.gz
ssh ubuntu@wandhoven.ddns.net "
cd /media/B/html/RPG; 

mkdir _tmp
mv denanu-dnd/server_backend/data/.htaccess _tmp
mv denanu-dnd/server_backend/data/login _tmp
mv denanu-dnd/server_backend/data/files _tmp


sudo rm -r denanu-dnd; 
tar -xzf denanu-dnd.tar.gz; 

sudo rm -r denanu-dnd/server_backend/data/login
sudo rm -r denanu-dnd/server_backend/data/files
mv _tmp/login denanu-dnd/server_backend/data 
mv _tmp/files denanu-dnd/server_backend/data
sudo rm -r _tmp

rm denanu-dnd.tar.gz; 

cd denanu-dnd;
mv htaccess .htaccess; 

cd server_backend/data; 
sudo chmod 777 files login; 
mv htaccess .htaccess"
rm -r denanu-dnd