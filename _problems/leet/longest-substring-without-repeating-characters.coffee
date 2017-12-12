class LongestSubstring
  @question = () ->
    '''
    Given a string, find the length of the longest substring without repeating characters.
    '''

  @answer = () ->
    lengthOfLongestSubstring = (s) ->
      characters = s.split('')
      characterSet = new Set()
      longest = 0
      i = 0
      j = 0
      while i < s.length and j < s.length
        if characterSet.has(characters[j])
          characterSet.delete(characters[i++])
        else
          characterSet.add(characters[j++])
          longest = Math.max(longest, j - i)

      return longest
