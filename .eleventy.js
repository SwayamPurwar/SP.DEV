module.exports = function(eleventyConfig) {
  // Pass through your static assets
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("manifest.json");
  eleventyConfig.addPassthroughCopy("robots.txt");

  return {
    dir: {
      input: ".",
      includes: "_includes",
      output: "_site"
    }
  };
};