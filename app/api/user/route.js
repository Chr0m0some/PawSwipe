import dbConnect from "@/lib/mongodb";
import { User } from "@/mongoose/schema/User";
import { NextResponse } from 'next/server';
import { SwipedRight } from "../../../mongoose/schema/SwipedRight";

//Create new email address in to MongoDB -> for the landing page
export async function POST(req) {
    await dbConnect(); 
  
    let data;
    try {
      data = await req.json();
    } catch (error) {
      return new NextResponse('Invalid JSON input', { status: 400 });
    }
  
    if (!data) {
      return new NextResponse('Invalid request payload', { status: 400 });
    }
    
    const user = new User(data);
    const confirmedEmail = await user.save()

    if (!confirmedEmail) {
      return new NextResponse('Failed to save user', { status: 500 });
    }
    //create a swiperight profile in here

    const swipedRight = new SwipedRight({ email: confirmedEmail.email });
    const saved = await swipedRight.save()
    
    if (!saved){
      return new NextResponse('Failed to save swiped right profile', { status: 500 });
    }
    return new NextResponse(JSON.stringify(confirmedEmail), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
  }

  //Get a list of current users
export async function GET(req){
    await dbConnect();

    const users = await User.find()
    if (!users) {
        return new NextResponse('No user found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(users), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
}