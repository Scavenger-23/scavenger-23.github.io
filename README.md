# Crown‑Cap Collection Starter..

This is a minimal static website for cataloguing your crown‑cap (Kronkorken) collection.  

## How to use

1. **Add images**  
   Drop each JPG into the `images/` folder.  
   Name them something unique, e.g. `coke_dk_250ml_2024.jpg`.

2. **Update `caps.json`**  
   Each cap needs one JSON object, for example:
   ```json
   {
     "id": "coke_dk_250ml_2024",
     "brand": "Coca-Cola",
     "series": "Denmark 250 ml promo",
     "design": "Red with small 250 ml text",
     "image": "images/coke_dk_250ml_2024.jpg",
     "country": "DK",
     "year": 2024
   }
   ```

3. **Preview locally**  
   Open `index.html` in a browser — no server needed.

4. **Publish on GitHub Pages**  
   - Create a repo named `YOURNAME.github.io`  
   - Copy these files into it  
   - Commit & push — your site appears at `https://YOURNAME.github.io`

## Customising

* Modify the inline CSS in `index.html` or move it to `style.css`.  
* Add more filters/search in `script.js`.  
* Swap Tailwind, Bootstrap, etc., by adding their CDN link in `<head>`.
