"""testing stuff related to main
"""

from unittest import TestCase


class TestTheTest(TestCase):
    """Basic test to verify that the testing works
    """

    def test_math(self) -> None:
        """basic math test
        """
        actual = 1 + 2
        expect = 3
        self.assertEqual(actual, expect, 'basic math test does not work')

    def test_word(self) -> None:
        """basic math test
        """
        actual = 'Hello' + 'World'
        expect = 'HelloWorld'
        self.assertEqual(actual, expect, 'basic word test does not work')

    def test_raise(self) -> None:
        """basic error raising test
        """
        with self.assertRaises(TypeError, msg='basic error raising test does not work'):
            raise TypeError('not really a type error')
