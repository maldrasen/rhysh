describe("EnglishHelper", function() {

  describe('numberInEnglish()', function() {
    it('five', function() {
      expect(EnglishHelper.numberInEnglish(5)).to.equal('five');
    });

    it('thirteen', function() {
      expect(EnglishHelper.numberInEnglish(13)).to.equal('thirteen');
    });

    it('sixty-nine', function() {
      expect(EnglishHelper.numberInEnglish(69)).to.equal('sixty-nine');
    });

    it('one hundred sixty-nine', function() {
      expect(EnglishHelper.numberInEnglish(169)).to.equal('one hundred sixty-nine');
    });

    it('one thousand four hundred ninty-nine', function() {
      expect(EnglishHelper.numberInEnglish(1499)).to.equal('one thousand four hundred ninety-nine');
    });

    it('Seventy', function() {
      expect(EnglishHelper.NumberInEnglish(70)).to.equal('Seventy');
    });

    it("A big black cock", function() {
      expect(EnglishHelper.NumberInEnglish(1,{ whenOne:'a' })).to.equal('A');
    });

    it("And no tits", function() {
      expect(EnglishHelper.numberInEnglish(0,{ whenZero:'no' })).to.equal('no');
    });
  });

});
