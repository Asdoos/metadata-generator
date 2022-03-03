// ----- Directory -----

const dir = "C:\\Users\\Andre\\Documents\\Programme\\metadata-generator\\collection\\"

// ---------------------
const fs = require( 'fs' );
const path = require( 'path' );
const naturalCompare = require("natural-compare-lite");


const dir_json_old = dir + "\json\\";
const dir_images_old = dir + "\images\\";

const dir_json_new = dir + "\json_gen\\";
const dir_images_new = dir + "\images_gen\\";

let metadata = [];
let counter = 0;

// Make an async function that gets executed immediately
(async ()=>{
    // Our starting point
    try {
        // Get the files_json as an array
        const files_json = await fs.promises.readdir( dir_json_old );
        files_json.sort(naturalCompare)
        if (files_json[0] == "_metadata.json") files_json.shift()

        //Get files_png as an array
        const files_images = await fs.promises.readdir( dir_images_old );
        files_images.sort(naturalCompare)
        if (files_images.indexOf("desktop.ini") != -1) files_images.splice(files_images.indexOf("desktop.ini"), 1)

        if (files_json.length!=files_images.length){
            console.log("Ungleiche Dateianzahl!")
            console.log("JSON: ", files_json.length)
            console.log("Images: ", files_images.length)
            //throw "Ungleiche Dateianzahl!";
        }

        let error = false;

        // Comparing each element of array
        for(let i=0; i<files_json.length; i++){
            var number = path.parse(files_json[i]).name
            if(files_images.indexOf(number+".png") === -1){
                console.log("Fehler in Dateien! JSON hat ", files_json[i], " fehlt aber in den Bildern")
                error = true;
            }
        }

        // Comparing each element of array
        for(let i=0; i<files_images.length; i++){
            var number = path.parse(files_images[i]).name
            if(files_json.indexOf(number+".json") === -1){
                console.log("Fehler in Dateien! Images hat ", files_images[i], " fehlt aber in den JSON")
                error = true
            }
        }

        if (error) return

        //Create Gen Folders
        if (!fs.existsSync(dir_json_new)){
            fs.mkdirSync(dir_json_new);
        }
        if (!fs.existsSync(dir_images_new)){
            fs.mkdirSync(dir_images_new);
        }

        // Loop them all with the new for...of
        for( const file of files_json ) {
            // Get the full paths
            const filePath = path.join( dir_json_old, file );
            const jsonData= require(filePath);

            //console.log(file)
            //console.log(filePath)

            jsonData.name = "SolSwines #"+counter
            jsonData.edition = counter

            //Write new json
            fs.writeFile(dir_json_new + counter + '.json', JSON.stringify(jsonData, null, 4), (err) => {

                // In case of a error throw err.
                if (err) throw err;
            })

            //Copy Image to JSON
            fs.copyFile(dir_images_old + path.parse(file).name + ".png", dir_images_new + counter + ".png", (err) => {
                if (err) throw err;
            });

            counter = counter+1;

            metadata.push(jsonData)

        } // End for...of

        fs.writeFile(dir_json_new + '_metadata.json', JSON.stringify(metadata, null, 4), (err) => {

            // In case of a error throw err.
            if (err) throw err;
        })
    }
    catch( e ) {
        // Catch anything bad that happens
        console.error( "We've thrown! Whoops!", e );
    }

})(); // Wrap in parenthesis and call now


