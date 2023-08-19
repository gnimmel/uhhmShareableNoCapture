# uhhmShareableNoCapture
UHHM shareable asset - p5js, node, glsl

# Ffmpeg Server Rendering

This repo does not include the code for the ffmpeg server renderer.
###
**Render Repo:**
https://github.com/gnimmel/uhhm-shareable-ffmpegserver

### TODOS:
- Reimplement ffmpeg server code and relevant files
- Reimplement playwright
- Output directory
- Handle output video duration
- Asset upload to google cloud?
- onComplete event handler
- Additional endpoints, if needed
  

# API Documentation

## Endpoints

The API consists of the following endpoints:

- `POST /add-asset-data`
- `GET /get-sketch-by-id`

---

### POST /add-asset-data

This endpoint is used to add asset data to the system.

#### Request

The request body should be a JSON object with the following properties:

| Property | Type   | Description                       |
|----------|--------|-----------------------------------|
| `id`     | String | The unique id of the asset          |
| `emotion`| String | The emotion from GPT          |
| `lyrics` | [ [String], [String]... ] | The lyrics from GPT     |

##### Example

```json
{
  "id": "12345",
  "emotion": "competitive",
  "lyrics": [
        [
        "Don't know where she gets it,",
        "Dem golden vocals be hittin'.",
        "Leavin' legends in her wake,",
        "Every note she take, a heartbreak."
        ],
        [
        "Reminiscing on the early days,",
        "Workin' hard, no time to laze.",
        "Bittersweet, the memories flow,",
        "Humble beginnings, watch her glow."
        ]]
}
```

#### Valid Values for `emotion`

The `emotion` property can take one of the following string values:

- "competitive"
- "inspired"
- "emotional"
- "nostalgic"


### Success Response

**Condition** : If everything is OK and data is added successfully.

**Code** : `202 ACCEPTED`

**Content example**

```json
{
    "message": "data added successfully",
    "id": "123456"
}
```

### Error Responses

**Condition** : If 'id', 'emotion' or 'lyrics' is missing in the request body.

**Code** : `400 BAD REQUEST`

**Content** : 

```json
{
    "message": "Request body should contain id, lyrics, emotion"
}
```

---

## GET /get-sketch-by-id

This endpoint is used to fetch a sketch by its id from the database.

**URL** : `/get-sketch-by-id?id={id}`

**Method** : `GET`

**URL Parameters** : #### Request

| Property | Type   | Description                       |
|----------|--------|-----------------------------------|
| `id`     | String | The unique id of the asset          |

### Success Response

**Condition** : If everything is OK and the sketch exists in the database.

**Code** : `200 OK`

**Content example**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <link rel="icon" href="data:image/x-icon;,">
    <link rel="stylesheet" type="text/css" href="/shareable.css">
    <!--<script src="https://cdn.jsdelivr.net/npm/p5/lib/p5.min.js"></script>-->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
    
  </head>
  <body>
    <div id="container">
      <div id="the-sketch"></div>
    </div>
  </body>
  
  <script type="module" src="/shareable-main.js"></script>
  <script>
    let id = "<%= id %>";
    let serverIp = "<%= serverIp %>";
  </script>

</html> 
```

### Error Responses

**Condition** : If the sketch does not exist in the database.

**Code** : `404 NOT FOUND`

**Content** : 

```json
{
    "error": "No data found for this id"
}
```

**Condition** : If there was an internal error.

**Code** : `500 INTERNAL SERVER ERROR`

**Content** : 

```json
{
    "error": "Internal server error"
}
```
