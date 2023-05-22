
clear
yarn build
mv build denanu-dnd
tar -czf denanu-dnd.tar.gz denanu-dnd
scp denanu-dnd.tar.gz ubuntu@wandhoven.ddns.net:/media/B/html/RPG/
rm denanu-dnd.tar.gz
ssh ubuntu@wandhoven.ddns.net "cd /media/B/html/RPG; rm -r denanu-dnd; tar -xzf denanu-dnd.tar.gz; rm denanu-dnd.tar.gz; cd denanu-dnd; mv htaccess .htaccess"
rm -r denanu-dnd
