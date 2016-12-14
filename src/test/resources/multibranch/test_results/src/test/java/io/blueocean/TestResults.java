package org.sonatype.mavenbook;

import junit.framework.Test;
import junit.framework.TestCase;
import junit.framework.TestSuite;

import java.lang.InterruptedException;
/**
 * Unit test for simple App.
 */
public class TestResults extends TestCase
{
    /**
     * Create the test case
     *
     * @param testName name of the test case
     */
    public TestResults( String testName )
    {
        super( testName );
    }

    /**
     * @return the suite of tests being tested
     */
    public static Test suite()
    {
        return new TestSuite( TestResults.class );
    }

    /**
     * Rigourous Test :-)
     */
    public void testCase() throws InterruptedException
    {
        throw new InterruptedException();
    }
}
