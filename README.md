# AAO Access Command Line Utility

## What you need to use this tool

1. a .env file containing the Bearer Token to talk to AAO. See the `.env.sample` file for details.
2. A list of emails as an array of strings in a json file.

    Example:

    ```json
    [
        "person@email.com",
        "person2@email.com
    ]
    ```

3. A task id GUID from the Course Catalog for the week in question.

[Course Catalog](https://docs.google.com/spreadsheets/d/1wbQXuBVrOibPaBVt9mGuNOwhHN0PzN25n83b0hSk_To/edit#gid=0)

## Running the script

first, install the script.

```shell
npm install
npm link
```

Then you run it like so:

```shell
aao-access -f emails.json -t ca3f518c-f1cf-46b6-9438-936f127d4ab1
```

I suggest you make a list containing instructor emails and another file containing student emails.
