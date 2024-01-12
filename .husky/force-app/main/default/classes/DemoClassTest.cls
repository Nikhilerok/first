@isTest
private class DemoClassTest {
    // Test method to cover the addNumbers method in DemoClass
    @isTest
    static void testAddNumbers() {
        // Arrange
        DemoClass demo = new DemoClass();
        Integer number1 = 5;
        Integer number2 = 10;
        
        // Act
        Integer result = demo.addNumbers(number1, number2);
        
        // Assert
        System.assertEquals(15, result, 'The result should be the sum of number1 and number2');
    }
}