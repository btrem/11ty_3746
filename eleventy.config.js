const Image = require("@11ty/eleventy-img");
const path = require("path");


/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = function (eleventyConfig) {

    eleventyConfig.addShortcode("myImage", async function (src, alt="") {

        // responsive image settings; adjust to your taste
        const formats = ["webp",null];
        const widths = [250,500,1000];
        const sizes = "100w";

        // image slug and extension
        const imageFileSlug = path.basename(src, path.extname(src));
        const imageFileExt = path.extname(src);

        // url path for processed images; adjust to taste
        const imageUrlPath = "/images/";

        // place for processed images
        const imageOutputDir = `./_site/${imageUrlPath}/`;

        // create image files for light mode
        let metadataLight = await Image(`image_src/${imageFileSlug}-light${imageFileExt}`, {
            formats: formats,
            sizes: sizes,
            widths: widths,
            outputDir: imageOutputDir,
            urlPath: imageUrlPath,
        });

        // create image files for dark mode
        let metadataDark = await Image(`image_src/${imageFileSlug}-dark${imageFileExt}`, {
            formats: formats,
            sizes: sizes,
            widths: widths,
            outputDir: imageOutputDir,
            urlPath: imageUrlPath,
        });

        // create source elements for light mode
        let markupLight = `${Object.values(metadataLight)
            .map((imageFormat) => {
                return `<source srcset="${imageFormat
                    .map((entry) => entry.srcset)
                    .join(", ")}" sizes="${sizes}" type="${
                    imageFormat[0].sourceType
                }" media="(prefers-color-scheme: light)">`;
            })
            .join("\n    ")}`
        ;

        // create source elements for dark mode
        let markupDark = `${Object.values(metadataDark)
            .map((imageFormat) => {
                return `<source srcset="${imageFormat
                    .map((entry) => entry.srcset)
                    .join(", ")}" sizes="${sizes}" type="${
                    imageFormat[0].sourceType
                }" media="(prefers-color-scheme: dark)">`;
            })
            .join("\n    ")}`
        ;

        // get file name etc. for default image
        let imgData = metadataLight.png[0];

        // create and return picture markup
        return markup = `<picture>
    ${markupLight}
    ${markupDark}
    <img src="${imgData.url}" alt="${alt}">
</picture>`;

    });


    // 11ty defaults
    return {
        dir: {
            input: "src",
        },
    };
};
