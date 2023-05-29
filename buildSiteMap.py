import xml.etree.cElementTree as ET
from xml.dom import minidom
from datetime import datetime

_url = "https://wandhoven.ddns.net/RPG/denanu-dnd/"  # <-- Your website domain.
dt = datetime.now().strftime("%Y-%m-%d")  # <-- Get current date and time.
sitemapFile = "public/sitemap.xml"

def prettify(elem):
    """Return a pretty-printed XML string for the Element.
    """
    rough_string = ET.tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

def generateURL(root, url, priority="1.0", updatefreq="weakly"):
  doc = ET.SubElement(root, "url")
  ET.SubElement(doc, "loc").text = _url + url
  ET.SubElement(doc, "lastmod").text = dt
  ET.SubElement(doc, "changefreq").text = updatefreq
  ET.SubElement(doc, "priority").text = priority


def generate_sitemap():
  root = ET.Element("urlset")
    
  generateURL(root, "monsters")

  with open(sitemapFile, "w") as file:
    file.write(prettify(root))

generate_sitemap()

