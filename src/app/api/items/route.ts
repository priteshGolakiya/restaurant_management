import { NextResponse } from 'next/server';

export async function GET() {
    // Define your data
    const data =[ 
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
        {
        itemid: 1,
        itemname: 'try item',
        description: 'try item dis',
        price: 1000,
        categoryid: 5,
        isactive: true,
        itemimage: {
            img1: 'https://images.unsplash.com/photo-1725714354876-0b0c909c611b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDEyfHhqUFI0aGxrQkdBfHxlbnwwfHx8fHw%3D'
        }
    },
];

    // Return JSON response
    return NextResponse.json(data, { status: 200 });
}
