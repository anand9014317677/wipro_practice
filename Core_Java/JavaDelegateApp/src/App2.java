interface Allocator
{
    void taskAllocation(String user);
}

class Manager1 implements Allocator
{
    public void taskAllocation(String user)
    {
        System.out.println("Task is allocated by : Manager to " + user);
    }
}

class TeamLead1 implements Allocator
{
    public void taskAllocation(String user)
    {
        System.out.println("Task is allocated by : Team Lead to " + user);
    }
}

// Loose Coupling

class Delegate1
{
    private Allocator allocator;

    public Delegate1(Allocator allocator)
    {
        this.allocator = allocator;
    }

    public void notifyUser()
    {
        allocator.taskAllocation("Niti");
    }
}

public class App2
{
    public static void main(String[] args)
    {
        Delegate1 delegate = new Delegate1(new Manager1());
        delegate.notifyUser();

        Delegate1 delegate2 = new Delegate1(new TeamLead1());
        delegate2.notifyUser();
    }
}