const { notFoundError, generalError } = require("./errors");

describe("Given a notFoundError function", () => {
  describe("When it receives a request", () => {
    test("Then it should call the method json with an error", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const mockedRes = mockRes();

      notFoundError(null, mockedRes);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });
});

describe("Given a generalError function", () => {
  describe("When it receives an error and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: 500,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an error without status and a response", () => {
    test("Then it should call method json", () => {
      const mockRes = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
      };

      const error = {
        message: "error",
        code: null,
      };

      const mockedRes = mockRes();

      generalError(error, null, mockedRes, null);

      expect(mockedRes.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an empty error and a response", () => {
    test("Then it should call methods status & json of res with 500 status code & error: true, message: 'General Error' respectively", async () => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const err = {};

      const errorMessage = { error: "General server error" };
      const status = 500;

      await generalError(err, null, res, null);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith(errorMessage);
    });
  });
});
