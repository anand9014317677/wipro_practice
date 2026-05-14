class Manager
{
    public void taskAllocation(String user)
    {
        System.out.println("Task is allocated by : Manager to " + user);
    }
}

class TeamLead
{
    public void taskAllocation(String user)
    {
        System.out.println("Task is allocated by : Team Lead to " + user);
    }
}

// Tight Coupling

class Delegate
{
    private TeamLead teamlead = new TeamLead();

    public void notifyUser()
    {
        teamlead.taskAllocation("Niti");
    }
}

public class App
{
    public static void main(String[] args)
    {
        Delegate d = new Delegate();
        d.notifyUser();
    }
}