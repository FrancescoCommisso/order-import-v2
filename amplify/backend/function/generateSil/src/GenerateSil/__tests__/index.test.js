const GenerateSil = require("../index");

describe("GenerateSil", () => {
  test("weighted", () => {
    const TEST_SILDATA = require("./test-data/weighted-silData.json");
    const EXPECTED = require("./test-data/weighted-expected");
    const sil = new GenerateSil().generateSil({ silData: TEST_SILDATA });
    console.log(sil);
    expect(sil).toEqual(EXPECTED);
  });

  test("no weighted", () => {
    const TEST_SILDATA = require("./test-data/no-weighted-silData.json");
    const EXPECTED = require("./test-data/no-weighted-expected");
    const sil = new GenerateSil().generateSil({ silData: TEST_SILDATA });
    console.log(sil);
    expect(sil).toEqual(EXPECTED);
  });
});
