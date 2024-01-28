# floatify README

Floatify is an extension for converting all non-specified floating point numbers in a C# file to floats on save. That is `1.0` -> `1.0f` on save.

This is useful when programming games in engines such as Unity, where most floating point math is done with floats. Other C# game engines also use floats for most calculations, and having to write the f suffix on every number manually is slow and obtrusive.

## Features

NOTE: Read [Requirements](#requirements) below for how to enable the plugin.

On save converts all non-specified floating point numbers to floats instead of the default double.

Before saving:

```cs
var floaing = 1000.01; 
var floatMe = 1.0; 
var int_ = 1; 
var double_ = 1000.0d; 
var money_ = 1000.0m; 
var text = "100.0";
var vec = new Vector3(1.23, 14.3, 10.9);
var math = 1.0 + 13.0 + 44.0 * 1.4 * 1;
```

// After save:

```cs
var floaing = 1000.01f; // Floated
var floatMe = 1.0f; // Converted to float
var int_ = 1; // Kept as int
var double_ = 1000.0d; // Kept as double
var money_ = 1000.0m; // Kept as money
var text = "100.0"; // Unchanged (somewhat understands strings)
var vec = new Vector3(1.23f, 14.3f, 10.9f); // Converted to floats
var math = 1.0f + 13.0f + 44.0f * 1.4f * 1; // Converted to floats except where its an int
```

## Requirements

As this is a very intrusive and breaking extension for projects that are not using floats as the default we require a floatify.json file in any parent folder to the current script you are editing for this extension to have any effect. If this files contains the below .json the extension is enabled on save.

NOTE: If this file does not exist this extension does NOTHING.

```json
// floatify.json
{
    "enabled": true
}
```

## Known Issues

This has problems identifying if numbers are inside strings.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release with known bugs