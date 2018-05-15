// DO NOT MODIFY THIS FILE. THIS IS A DOCUMENTATION FOR VALIDATOR.

const { isValidXML } = require("../src");

describe("basic isValidXML test", () => {
  describe("given valid xml", () => {
    it("should return true for an xml with a single empty node 1", () => {
      expect(isValidXML("<a />")).toBeTruthy();
    });

    it("should return true for an xml with a single empty node 2", () => {
      expect(isValidXML("<a></a>")).toBeTruthy();
    });

    it("should return true for an xml with a single node", () => {
      expect(isValidXML("<a>test</a>")).toBeTruthy();
    });

    it("should return true for an xml with a single nested node", () => {
      expect(isValidXML("<a><b></b></a>")).toBeTruthy();
    });

    it("should return true for an xml with multiple top level nodes", () => {
      expect(isValidXML("<a></a><b></b>")).toBeTruthy();
    });
  });

  describe("given invalid xml", () => {
    it("should return false for an xml with a start tag without an end tag", () => {
      expect(isValidXML("<a>")).toBeFalsy();
    });

    it("should return false for an xml with bad tags", () => {
      expect(isValidXML("<<a></a>")).toBeFalsy();
    });

    it("should return false for an xml with badly ordered tags", () => {
      expect(isValidXML("<a><b></a></b>")).toBeFalsy();
    });
  });

  describe("given invalid xml per Vingle's rules", () => {
    it("should return false for an xml with a node containing a node with the same tag", () => {
      expect(isValidXML("<a><a></a></a>")).toBeFalsy();
    });

    it("should return false for an xml with consecutive nodes of the same tag", () => {
      expect(isValidXML("<a></a><a></a>")).toBeFalsy();
    });

    it("should return false for an xml with a depth of more than 2.", () => {
      expect(isValidXML("<a><b><c><d></d></c></b></a>")).toBeFalsy();
    });
  });
});
