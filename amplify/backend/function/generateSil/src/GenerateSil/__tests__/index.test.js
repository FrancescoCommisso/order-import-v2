const GenerateSil = require("../index");

describe("GenerateSil", () => {
  test("main", () => {
    const TEST_SILDATA = require("./test-data/silData.json");
    const EXPECTED = require("./test-data/expected");
    const sil = new GenerateSil().generateSil({ silData: TEST_SILDATA });
    console.log(sil);
    expect(sil).toEqual(EXPECTED);
  });
});
