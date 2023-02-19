# HuggingInfo

Unofficial library to retrieve information from the HuggingFace website.

## Installation

```bash
npm install @bocchilorenzo/hugginginfo
```

## Usage

```js
const HuggingInfo = require("@bocchilorenzo/hugginginfo");
const hf = new HuggingInfo();
```

## Methods

### `getTasks()`

Fetches the tasks available from the Huggingface model hub (on the left of the page at [huggingface.co/models](https://huggingface.co/models)). Returns a promise that resolves to an object.

```js
hf.getTasks().then((tasks) => {
    console.log(tasks);
});
```

Example response:

```json
{
    "url": "https://huggingface.co/models",
    "tasks": {
        {
            "name": "Feature Extraction",
            "url": "/models?pipeline_tag=feature-extraction"
        },
        {
            "name": "Text-to-Image",
            "url": "/models?pipeline_tag=text-to-image"
        }
        ...
    }
}
```

### `getModelList()`

Fetches the model list from the Huggingface model hub for a certain task. Parameters:

-   `task`: The task to fetch models for. Must be filled with a valid task.
-   `sortBy`: The field to sort by. Defaults to "downloads".
-   `page`: The page to fetch. Defaults to 0.

Returns a promise that resolves to an object.

```js
hf.getModelList("fill-mask").then((models) => {
    console.log(models);
});
```

Example response:

```json
{
  "url": "https://huggingface.co/models?pipeline_tag=fill-mask&sort=downloads&p=0",
  "totalModels": 5738,
  "models": [
    {
      "name": "bert-base-uncased",
      "lastUpdated": "Nov 16, 2022",
      "downloads": "31.7M",
      "likes": "523"
    },
    {
      "name": "emilyalsentzer/Bio_ClinicalBERT",
      "lastUpdated": "Feb 27, 2022",
      "downloads": "12.2M",
      "likes": "70"
    },
    ...
  ],
  "nextPage": 1
}
```

### `getModelInfo()`

Fetches model information from the Huggingface model hub. Parameters:
- `name`: The name of the model.

Returns a promise that resolves to an object.

```js
hf.getModelInfo("bert-base-uncased").then((model) => {
    console.log(model);
});
```

Example response:

```json
{
  "url": "https://huggingface.co/bert-base-uncased",
  "name": "bert-base-uncased",
  "shortDescription": "Pretrained model on English language using a masked language modeling (MLM) objective. It was introduced in this paper and first released in this repository. This model is uncased: it does not make a difference between english and English.",
  "downloads": 31684957,
  "likes": 523,
  "tags": [
    "Fill-Mask",
    "PyTorch",
    "TensorFlow",
    "JAX",
    "Rust",
    "Safetensors",
    "Transformers",
    "bookcorpus",
    "wikipedia",
    "English",
    "arxiv:1810.04805",
    "bert",
    "exbert",
    "AutoTrain Compatible"
  ],
  "license": "apache-2.0",
  "fillType": "[MASK]"
}
```

## Note

This library is not affiliated with Huggingface in any way. All the information is retrieved from the Huggingface website. If you want to use this library in a project, please make sure to follow the [Huggingface Terms of Service](https://huggingface.co/terms-of-service).
